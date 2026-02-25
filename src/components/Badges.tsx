import React from 'react';
import { BriefItem, ItemStatus, ItemType } from '../types';
import { CheckCircle2, Circle, HelpCircle, AlertCircle, Clock, Check } from 'lucide-react';

export const StatusBadge = ({ status }: { status: ItemStatus }) => {
  const styles = {
    PENDING: 'bg-neutral-200 text-neutral-600 border-neutral-400',
    DISCUSSING: 'bg-amber-100 text-amber-800 border-amber-300',
    AGREED: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    REJECTED: 'bg-red-100 text-red-800 border-red-300',
  };

  const icons = {
    PENDING: <Circle className="w-3 h-3 mr-1" />,
    DISCUSSING: <Clock className="w-3 h-3 mr-1" />,
    AGREED: <CheckCircle2 className="w-3 h-3 mr-1" />,
    REJECTED: <AlertCircle className="w-3 h-3 mr-1" />,
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono border ${styles[status]}`}>
      {icons[status]}
      {status}
    </span>
  );
};

export const TypeBadge = ({ type }: { type: ItemType }) => {
  const styles = {
    EXACT: 'text-blue-700 bg-blue-50 border-blue-200',
    DEFER: 'text-purple-700 bg-purple-50 border-purple-200',
    ALTERNATIVE: 'text-orange-700 bg-orange-50 border-orange-200',
    QUESTION: 'text-neutral-700 bg-neutral-50 border-neutral-200',
  };

  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${styles[type]}`}>
      {type}
    </span>
  );
};
