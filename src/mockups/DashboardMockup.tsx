import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Show {
  id: string;
  name: string;
  venue: string;
  date: string;
  status: 'IN PROGRESS' | 'UPCOMING' | 'PAST';
  items: number;
}

const SHOWS: Show[] = [
  {
    id: 'show-0',
    name: 'Fake Flaviana Quintet',
    venue: 'Test Venue',
    date: 'Test Date',
    status: 'IN PROGRESS',
    items: 8,
  },
  {
    id: 'show-1',
    name: 'Paradiso – Main Stage',
    venue: 'Paradiso, Amsterdam',
    date: '15 Mar 2026',
    status: 'IN PROGRESS',
    items: 12,
  },
  {
    id: 'show-2',
    name: 'Melkweg OZ',
    venue: 'Melkweg, Amsterdam',
    date: '22 Mar 2026',
    status: 'UPCOMING',
    items: 8,
  },
  {
    id: 'show-3',
    name: 'Shelter',
    venue: 'Shelter, Amsterdam',
    date: '1 Feb 2026',
    status: 'PAST',
    items: 18,
  },
  {
    id: 'show-4',
    name: 'Tolhuistuin',
    venue: 'Tolhuistuin, Amsterdam',
    date: '10 Jan 2026',
    status: 'PAST',
    items: 9,
  },
];

const getStatusBadgeClasses = (status: Show['status']) => {
  switch (status) {
    case 'IN PROGRESS':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'UPCOMING':
      return 'bg-neutral-100 text-neutral-600 border-neutral-300';
    case 'PAST':
      return 'bg-neutral-100 text-neutral-400 border-neutral-200 opacity-50';
  }
};

export const DashboardMockup: React.FC = () => {
  const navigate = useNavigate();
  const { setLoggedIn } = useAuth();

  const handleLogout = () => {
    setLoggedIn(false);
    navigate('/login');
  };
  return (
    <div className="h-screen flex flex-col bg-[#E4E3E0] text-[#141414]">
      {/* Header */}
      <header className="h-14 border-b border-[#141414] bg-[#E4E3E0] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <Music className="w-5 h-5" />
          <h1 className="font-mono font-bold tracking-tighter text-sm flex items-baseline gap-0">
            <span className="text-[#141414]">TECH</span>
            <span className="text-emerald-500">RIDER</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 text-indigo-800 px-2 py-1 text-[10px] font-mono border border-indigo-200">
            BAND LEADER
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors rounded-full shrink-0"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-8 max-w-2xl mx-auto w-full">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xs font-mono uppercase tracking-widest opacity-50">Your Shows</h2>
          <button className="bg-[#141414] text-[#E4E3E0] px-4 py-2 font-mono text-xs uppercase tracking-wider hover:opacity-90 transition-opacity">
            + New Show
          </button>
        </div>

        {/* Shows List */}
        <div className="divide-y divide-[#141414]/10 border border-[#141414]/20">
          {SHOWS.map((show) => (
            <div
              key={show.id}
              onClick={() => navigate(`/dashboard/${show.id}`)}
              className="flex items-center gap-4 px-4 py-4 hover:bg-[#141414]/5 cursor-pointer transition-colors"
            >
              {/* Show Name */}
              <div className="font-mono font-bold text-sm flex-1 min-w-0 truncate">{show.name}</div>

              {/* Venue & Date */}
              <div className="text-[10px] font-mono opacity-50 uppercase shrink-0 text-right">
                <div>{show.venue}</div>
                <div>{show.date}</div>
              </div>

              {/* Brief Count */}
              <div className="text-[10px] font-mono opacity-40 shrink-0">{show.items} items</div>

              {/* Status Badge */}
              <div
                className={`inline-flex items-center px-3 py-1 text-xs font-mono border shrink-0 ${getStatusBadgeClasses(
                  show.status,
                )}`}
              >
                {show.status}
              </div>

              {/* Chevron */}
              <ChevronRight className="w-4 h-4 opacity-30 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
