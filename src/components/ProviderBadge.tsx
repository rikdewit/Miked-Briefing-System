import React from 'react';
import { BriefItem } from '../types';
import { Package, Music, UserCog } from 'lucide-react';

export const ProviderBadge = ({ provider }: { provider?: BriefItem['provider'] }) => {
  if (!provider) return null;

  const styles = {
    BAND: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    VENUE: 'bg-neutral-100 text-neutral-800 border-neutral-300',
    ENGINEER: 'bg-cyan-100 text-cyan-800 border-cyan-300',
  };

  const icons = {
    BAND: <Music className="w-3 h-3 mr-1 -mb-0.5" />,
    VENUE: <Package className="w-3 h-3 mr-1" />,
    ENGINEER: <UserCog className="w-3 h-3 mr-1" />,
  };

  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${styles[provider]}`}>
      {icons[provider]}
      {provider}
    </span>
  );
};
