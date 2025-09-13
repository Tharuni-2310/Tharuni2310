
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import UserDashboard from './pages/user/UserDashboard';
import BookingPage from './pages/user/BookingPage';
import TrackPage from './pages/user/TrackPage';
import AgentDashboard from './pages/agent/AgentDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import Header from './components/Header';
import Footer from './components/Footer';
import { Role } from './types';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <div className="flex flex-col min-h-screen bg-slate-900 text-slate-100 selection:bg-cyan-500/20">
          <Header />
          <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </HashRouter>
    </AuthProvider>
  );
};

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      
      {/* User Routes */}
      <Route path="/user/dashboard" element={user && user.role === Role.USER ? <UserDashboard /> : <Navigate to="/" />} />
      <Route path="/user/booking" element={user && user.role === Role.USER ? <BookingPage /> : <Navigate to="/" />} />
      <Route path="/user/track/:bookingId" element={user && user.role === Role.USER ? <TrackPage /> : <Navigate to="/" />} />

      {/* Agent Routes */}
      <Route path="/agent/dashboard" element={user && user.role === Role.AGENT ? <AgentDashboard /> : <Navigate to="/" />} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={user && user.role === Role.ADMIN ? <AdminDashboard /> : <Navigate to="/" />} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export const getDashboardRoute = (role: Role) => {
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

export default App;