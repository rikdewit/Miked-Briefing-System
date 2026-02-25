import React, { useState } from 'react';
import { BriefItem, Role, Category } from '../types';
import { StatusBadge } from './Badges';
import { ProviderBadge } from './ProviderBadge';
import { ChevronRight, Filter, Plus } from 'lucide-react';

interface BriefListProps {
  items: BriefItem[];
  selectedItem?: BriefItem | null;
  onSelectItem: (item: BriefItem) => void;
  role: Role;
  onAddItem: () => void;
}

export const BriefList: React.FC<BriefListProps> = ({ items, selectedItem, onSelectItem, role, onAddItem }) => {
  const [filterCategory, setFilterCategory] = useState<Category | 'ALL'>('ALL');

  const filteredItems = filterCategory === 'ALL' 
    ? items 
    : items.filter(i => i.category === filterCategory);

  const categories: Category[] = ['MONITORING', 'MICROPHONES', 'PA', 'BACKLINE', 'LIGHTING', 'STAGE', 'POWER', 'HOSPITALITY'];

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="flex justify-between items-center mb-6 p-1">
        <div className="flex gap-2 overflow-x-auto py-2">
          <button 
            onClick={() => setFilterCategory('ALL')}
            className={`px-3 py-1 text-xs font-mono border ${filterCategory === 'ALL' ? 'bg-[#141414] text-[#E4E3E0] border-[#141414]' : 'border-transparent hover:border-[#141414]'}`}
          >
            ALL
          </button>
          {categories.map(cat => {
            const categoryItems = items.filter(i => i.category === cat);
            const hasPending = categoryItems.some(i => i.status === 'PENDING');
            const hasDiscussing = categoryItems.some(i => i.status === 'DISCUSSING');
            const allAgreed = categoryItems.length > 0 && categoryItems.every(i => i.status === 'AGREED');
            
            return (
              <button 
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`relative px-3 py-1 text-xs font-mono border ${filterCategory === cat ? 'bg-[#141414] text-[#E4E3E0] border-[#141414]' : 'border-transparent hover:border-[#141414]'}`}
              >
                {cat}
                {hasDiscussing && (
                  <span className="absolute -top-1 right-0 w-2 h-2 bg-amber-400 rounded-full border border-[#E4E3E0] z-10" />
                )}
                {hasPending && (
                  <span className={`absolute -top-1 w-2 h-2 bg-white rounded-full border border-[#E4E3E0] ${hasDiscussing ? 'right-1.5' : 'right-0'}`} />
                )}
                {allAgreed && !hasPending && !hasDiscussing && (
                  <span className="absolute -top-1 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-[#E4E3E0] z-10" />
                )}
              </button>
            );
          })}
        </div>
        {/* Engineer can also add items now */}
        <button 
          onClick={onAddItem}
          className="flex items-center gap-2 bg-[#141414] text-[#E4E3E0] px-4 py-2 font-mono text-xs hover:bg-opacity-90 transition-opacity"
        >
          <Plus className="w-3 h-3" />
          NEW ITEM
        </button>
      </div>

      {/* Grid Header */}
      <div className="grid grid-cols-12 gap-4 px-4 py-2 border-b border-[#141414] opacity-50 text-[10px] uppercase font-serif-italic tracking-wider">
        <div className="col-span-1">Status</div>
        <div className="col-span-1">Provider</div>
        <div className="col-span-2">Category</div>
        <div className="col-span-4">Item / Description</div>
        <div className="col-span-2">Requested By</div>
        <div className="col-span-2 text-right">Action</div>
      </div>

      {/* Grid Body */}
      <div className="divide-y divide-[#141414]/20">
        {filteredItems.map((item) => {
          const isSelected = selectedItem?.id === item.id;
          return (
            <div 
              key={item.id}
              onClick={() => onSelectItem(item)}
              className={`grid grid-cols-12 gap-4 px-4 py-4 transition-colors cursor-pointer group items-center ${
                isSelected 
                  ? 'bg-[#141414] text-[#E4E3E0]' 
                  : 'hover:bg-neutral-300'
              }`}
            >
              <div className="col-span-1">
                <StatusBadge item={item} />
              </div>
              <div className="col-span-1">
                <ProviderBadge provider={item.provider} />
              </div>
              <div className="col-span-2 font-mono text-xs opacity-70 group-hover:opacity-100">
                {item.category}
              </div>
              <div className="col-span-4">
                <div className="font-bold font-mono text-sm">{item.title}</div>
                <div className="text-xs opacity-60 truncate group-hover:opacity-90">{item.description}</div>
              </div>
              <div className="col-span-2 font-mono text-xs opacity-70 group-hover:opacity-100">
                {item.requestedBy}
              </div>
              <div className="col-span-2 flex justify-end">
                <ChevronRight className={`w-4 h-4 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
