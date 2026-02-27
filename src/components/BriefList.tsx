import React, { useState } from 'react';
import { BriefItem, Role, Category } from '../types';
import { StatusBadge } from './Badges';
import { ProviderBadge } from './ProviderBadge';
import { ChevronRight, Plus } from 'lucide-react';

interface BriefListProps {
  items: BriefItem[];
  selectedItem?: BriefItem | null;
  onSelectItem: (item: BriefItem) => void;
  role: Role;
  onAddItem: () => void;
}

export const BriefList: React.FC<BriefListProps> = ({ items, selectedItem, onSelectItem, role, onAddItem }) => {
  const categories: Category[] = ['MONITORING', 'MICROPHONES', 'PA', 'BACKLINE', 'LIGHTING', 'STAGE', 'POWER', 'HOSPITALITY'];

  const groupedItems = categories.reduce((acc, cat) => {
    acc[cat] = items.filter(i => i.category === cat);
    return acc;
  }, {} as Record<Category, BriefItem[]>);

  return (
    <div className="w-full">
      {/* Sticky header group — toolbar + column labels together to avoid gap */}
      <div className="sticky top-0 z-20">
        {/* Toolbar */}
        <div className="bg-[#E4E3E0] flex justify-end items-center px-4 py-3 border-b border-[#141414]/10">
          <button
            onClick={onAddItem}
            className="flex items-center gap-2 bg-[#141414] text-[#E4E3E0] px-3 py-1.5 font-mono text-xs hover:bg-opacity-90 transition-opacity"
          >
            <Plus className="w-3 h-3" />
            NEW
          </button>
        </div>

        {/* Column Headers */}
        <div
          className="bg-[#D9D8D5] grid gap-2 px-3 py-2 border-b border-[#141414]/10 text-xs font-mono uppercase items-center"
          style={{
            gridTemplateColumns: '130px 90px 1fr 70px 24px'
          }}
        >
          <div className="flex justify-center">Status</div>
          <div className="flex justify-center">Provider</div>
          <div>Item / Description</div>
          <div className="text-right hidden sm:block">By</div>
          <div></div>
        </div>
      </div>

      {/* Grouped Sections */}
      <div className="divide-y divide-[#141414]/10">
        {categories.map((cat) => {
          const categoryItems = groupedItems[cat];

          return (
            <div key={cat} className="bg-[#E4E3E0]">
              {/* Category Header */}
              <div className="px-4 py-2.5 border-b border-[#141414]/5">
                <span className="text-xs font-mono uppercase font-bold tracking-widest">
                  {cat}
                </span>
              </div>

              {/* Category Items */}
              {categoryItems.length > 0 ? (
                <div className="divide-y divide-[#141414]/10">
                  {categoryItems.map((item) => {
                    const isSelected = selectedItem?.id === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectItem(item);
                        }}
                        className={`grid gap-2 px-3 py-3 transition-colors cursor-pointer group items-center ${
                          isSelected
                            ? 'bg-[#141414] text-[#E4E3E0]'
                            : 'hover:bg-neutral-300'
                        }`}
                        style={{
                          gridTemplateColumns: '130px 90px 1fr 70px 24px'
                        }}
                      >
                        {/* Status Icon */}
                        <div className="flex justify-center flex-shrink-0">
                          <StatusBadge item={item} />
                        </div>

                        {/* Provider Icon */}
                        <div className="flex justify-center flex-shrink-0">
                          <ProviderBadge provider={item.provider} />
                        </div>

                        {/* Title + Description */}
                        <div className="min-w-0">
                          <div className="font-bold font-mono text-xs leading-tight truncate">{item.title}</div>
                          <div className={`text-xs leading-tight truncate ${isSelected ? 'opacity-70' : 'opacity-60 group-hover:opacity-80'}`}>
                            {item.description}
                          </div>
                        </div>

                        {/* Requested By (abbreviated) */}
                        <div className="font-mono text-xs opacity-70 group-hover:opacity-100 text-right flex-shrink-0 hidden sm:block">
                          {item.requestedBy.split(' ')[0]}
                        </div>

                        {/* Action Arrow */}
                        <div className="flex justify-end flex-shrink-0">
                          <ChevronRight className={`w-4 h-4 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="px-4 py-4 text-xs opacity-40 font-mono text-center">
                  No items
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
