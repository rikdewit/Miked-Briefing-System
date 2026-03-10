import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const LoginMockup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setLoggedIn } = useAuth();

  const handleSignIn = () => {
    setLoggedIn(true);
    navigate('/dashboard');
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#E4E3E0]">
      <div className="max-w-[380px] w-full px-8 py-10 border border-[#141414]/20 bg-white">
        {/* Brand Header */}
        <div className="mb-3">
          <h1 className="font-mono font-bold tracking-tighter text-lg flex items-baseline gap-0">
            <span className="text-[#141414]">TECH</span>
            <span className="text-emerald-500">RIDER</span>
          </h1>
          <p className="text-xs font-mono opacity-40 uppercase tracking-widest mt-1">
            show day agreements
          </p>
        </div>

        <div className="border-b border-[#141414]/10 my-6" />

        {/* Email Field */}
        <div className="mb-4">
          <label className="block text-xs font-mono uppercase opacity-60 mb-2 flex items-center gap-1">
            <Mail className="w-3 h-3" />
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full bg-[#E4E3E0] border border-[#141414] p-2 font-mono text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <label className="block text-xs font-mono uppercase opacity-60 mb-2 flex items-center gap-1">
            <Lock className="w-3 h-3" />
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-[#E4E3E0] border border-[#141414] p-2 font-mono text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Sign In Button */}
        <button
          onClick={handleSignIn}
          className="w-full bg-[#141414] text-[#E4E3E0] py-3 font-mono text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
        >
          Sign In
        </button>

        {/* OR Divider */}
        <div className="flex items-center gap-3 my-5">
          <hr className="flex-1 border-[#141414]/10" />
          <span className="text-[10px] font-mono opacity-40 uppercase tracking-wider">or</span>
          <hr className="flex-1 border-[#141414]/10" />
        </div>

        {/* Google Button */}
        <button className="w-full border border-[#141414] py-3 font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#141414]/5 transition-colors">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
          Google
        </button>

        {/* Sign Up Link */}
        <p className="text-[10px] font-mono opacity-50 text-center mt-6 uppercase tracking-wider">
          No account? <span className="opacity-100 underline cursor-pointer">Sign Up</span>
        </p>
      </div>
    </div>
  );
};
