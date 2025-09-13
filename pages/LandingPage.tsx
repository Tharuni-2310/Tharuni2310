
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

const FeatureCard: React.FC<{ icon: JSX.Element; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 text-center transform hover:scale-105 hover:border-cyan-500/50 transition-all duration-300 shadow-lg">
        <div className="flex justify-center mb-4 text-cyan-400">{icon}</div>
        <h3 className="text-xl font-bold mb-2 text-slate-100">{title}</h3>
        <p className="text-slate-400">{description}</p>
    </div>
);


const LandingPage: React.FC = () => {
    const { selectRole } = useAuth();
    const navigate = useNavigate();

    const getDashboardRoute = (role: Role) => {
        switch (role) {
            case Role.USER:
                return '/user/dashboard';
            case Role.AGENT:
                return '/agent/dashboard';
            case Role.ADMIN:
                return '/admin/dashboard';
            default:
                return '/';
        }
    };

    const handleSelectRole = (role: Role) => {
        selectRole(role);
        navigate(getDashboardRoute(role));
    };

  return (
    <div className="text-center">
      <div className="py-24">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-100 mb-6">
          Your Luggage, 
          <span className="block bg-gradient-to-r from-cyan-400 to-primary-500 text-transparent bg-clip-text mt-2">
            Our Priority.
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-10">
          Select a role below to explore the LockNGo platform. No login required.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button onClick={() => handleSelectRole(Role.USER)} className="px-8 py-3 text-lg font-bold w-full sm:w-auto">
                View as User
            </Button>
            <Button onClick={() => handleSelectRole(Role.AGENT)} variant="secondary" className="px-8 py-3 text-lg font-bold w-full sm:w-auto">
                View as Agent
            </Button>
             <Button onClick={() => handleSelectRole(Role.ADMIN)} variant="secondary" className="px-8 py-3 text-lg font-bold w-full sm:w-auto">
                View as Admin
            </Button>
        </div>
      </div>

      <div className="py-20">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}
                title="1. Book Online"
                description="Easily schedule a pickup and drop-off for your luggage through our simple booking form."
            />
            <FeatureCard 
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                title="2. Live Tracking"
                description="Our agent picks up your bags. Track their journey in real-time on the map until delivery."
            />
            <FeatureCard 
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
                title="3. Secure Delivery"
                description="Verify the delivery with a unique QR code. Your luggage arrives safely at its destination."
            />
          </div>
      </div>
    </div>
  );
};

export default LandingPage;