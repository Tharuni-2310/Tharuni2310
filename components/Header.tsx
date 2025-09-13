
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSwitchRole = () => {
    logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    switch (user.role) {
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

  return (
    <header className="bg-slate-900/70 backdrop-blur-sm sticky top-0 z-50 border-b border-slate-700/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-slate-100 tracking-tight">
            Lock<span className="text-cyan-400">N</span>Go
          </Link>
          <nav className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-slate-300 hidden sm:inline capitalize">Viewing as: <strong>{user.role}</strong></span>
                <Link to={getDashboardPath()} className="px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-md hover:bg-cyan-700 transition-colors hidden sm:block">
                  Dashboard
                </Link>
                <button onClick={handleSwitchRole} className="px-4 py-2 text-sm font-medium text-cyan-400 bg-transparent border border-cyan-400 rounded-md hover:bg-cyan-400 hover:text-slate-900 transition-colors">
                  Switch Role
                </button>
              </>
            ) : (
              <span className="text-slate-400 text-sm">Select a role from the landing page to begin.</span>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;