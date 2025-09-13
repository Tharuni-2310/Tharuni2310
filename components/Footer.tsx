import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-slate-500">
        <p>&copy; {new Date().getFullYear()} LockNGo. All rights reserved.</p>
        <p className="text-sm">Your Luggage, Our Priority.</p>
      </div>
    </footer>
  );
};

export default Footer;