import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { getDashboardRoute } from '../App';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<Role>(Role.USER);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // FIX: The properties `login`, `register`, `loading`, `error`, and `setError` do not exist on the AuthContext.
  // Replaced with `selectRole` and implemented local state for loading and error handling.
  const { selectRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Simulate API call for login/register
      await new Promise(resolve => setTimeout(resolve, 800));

      // In this mock setup, we just select the role and navigate
      selectRole(role);
      navigate(getDashboardRoute(role));
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-10">
      <Card className="w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-slate-100 mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <p className="text-center text-slate-400 mb-8">Access your LockNGo dashboard</p>
        
        <div className="grid grid-cols-2 gap-2 mb-6 bg-slate-900/70 p-1 rounded-lg">
          <button onClick={() => setRole(Role.USER)} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${role === Role.USER ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}>I'm a User</button>
          <button onClick={() => setRole(Role.AGENT)} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${role === Role.AGENT ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}>I'm an Agent</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500" />
          )}
          <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500" />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500" />

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <Button type="submit" isLoading={loading} className="w-full py-3 text-base">
            {isLogin ? 'Login' : 'Create Account'}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button onClick={() => {setIsLogin(!isLogin); setError(null);}} className="ml-1 font-semibold text-cyan-400 hover:underline">
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </Card>
    </div>
  );
};

export default AuthPage;