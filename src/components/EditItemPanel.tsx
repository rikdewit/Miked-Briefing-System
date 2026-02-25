import React, { useState } from 'react';
import { BriefItem, Category } from '../types';
import { X, Save } from 'lucide-react';

interface EditItemPanelProps {
  item: BriefItem;
  onClose: () => void;
  onSave: (id: string, updates: Partial<BriefItem>) => void;
}

export const EditItemPanel: React.FC<EditItemPanelProps> = ({ item, onClose, onSave }) => {
  const [title, setTitle] = useState(item.title);
  const [category, setCategory] = useState<Category>(item.category);
  const [description, setDescription] = useState(item.description);
  const [specs, setSpecs] = useState(item.specs || {});
  const [provider, setProvider] = useState<BriefItem['provider']>(item.provider);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(item.id, {
      title,
      category,
      description,
      specs,
      provider
    });
    onClose();
  };

  return (
    <div className="w-[400px] bg-[#E4E3E0] border-l border-[#141414] h-full flex flex-col shadow-2xl z-20">
      {/* Header */}
      <div className="h-16 border-b border-[#141414] flex items-center justify-between px-6 shrink-0 bg-[#E4E3E0]">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <h2 className="text-xl font-bold font-mono tracking-tight">EDIT ITEM</h2>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors rounded-full">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
        <div>
          <label className="block text-xs font-mono uppercase opacity-60 mb-1">Title</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-white border border-[#141414] p-2 font-mono text-sm focus:outline-none focus:border-emerald-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase opacity-60 mb-1">Category</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full bg-white border border-[#141414] p-2 font-mono text-sm"
            >
              <option value="MICROPHONES">MICROPHONES</option>
              <option value="MONITORING">MONITORING</option>
              <option value="PA">PA</option>
              <option value="BACKLINE">BACKLINE</option>
              <option value="LIGHTING">LIGHTING</option>
              <option value="STAGE">STAGE</option>
              <option value="POWER">POWER</option>
              <option value="HOSPITALITY">HOSPITALITY</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase opacity-60 mb-1">Provider</label>
          <div className="flex gap-1 bg-black/5 p-1 rounded">
            <button 
              type="button"
              onClick={() => setProvider('BAND')}
              className={`flex-1 py-2 text-[10px] font-mono rounded text-center transition-all ${
                provider === 'BAND' 
                  ? 'bg-indigo-100 text-indigo-800 font-bold shadow-sm' 
                  : 'text-neutral-500 hover:bg-black/5'
              }`}
            >
              BAND
            </button>
            <button 
              type="button"
              onClick={() => setProvider('VENUE')}
              className={`flex-1 py-2 text-[10px] font-mono rounded text-center transition-all ${
                provider === 'VENUE' 
                  ? 'bg-neutral-100 text-neutral-800 font-bold shadow-sm' 
                  : 'text-neutral-500 hover:bg-black/5'
              }`}
            >
              VENUE
            </button>
            <button 
              type="button"
              onClick={() => setProvider('ENGINEER')}
              className={`flex-1 py-2 text-[10px] font-mono rounded text-center transition-all ${
                provider === 'ENGINEER' 
                  ? 'bg-cyan-100 text-cyan-800 font-bold shadow-sm' 
                  : 'text-neutral-500 hover:bg-black/5'
              }`}
            >
              ENGINEER
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase opacity-60 mb-1">Description</label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-white border border-[#141414] p-2 font-mono text-sm focus:outline-none focus:border-emerald-500 min-h-[100px] resize-none"
            required
          />
        </div>

        <div className="pt-4 border-t border-[#141414]/10">
          <h3 className="font-serif-italic text-sm opacity-50 uppercase tracking-wider mb-3">Specifications</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase opacity-60 mb-1">Make</label>
              <input 
                type="text" 
                value={specs.make || ''}
                onChange={(e) => setSpecs({...specs, make: e.target.value})}
                className="w-full bg-white border border-[#141414] p-2 font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase opacity-60 mb-1">Model</label>
              <input 
                type="text" 
                value={specs.model || ''}
                onChange={(e) => setSpecs({...specs, model: e.target.value})}
                className="w-full bg-white border border-[#141414] p-2 font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase opacity-60 mb-1">Quantity</label>
              <input 
                type="number" 
                value={specs.quantity || ''}
                onChange={(e) => setSpecs({...specs, quantity: parseInt(e.target.value) || undefined})}
                className="w-full bg-white border border-[#141414] p-2 font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase opacity-60 mb-1">Notes</label>
              <input 
                type="text" 
                value={specs.notes || ''}
                onChange={(e) => setSpecs({...specs, notes: e.target.value})}
                className="w-full bg-white border border-[#141414] p-2 font-mono text-sm"
              />
            </div>
          </div>
        </div>
      </form>

      {/* Footer Actions */}
      <div className="p-4 border-t border-[#141414] bg-[#E4E3E0] flex justify-end gap-2">
        <button 
          type="button" 
          onClick={onClose}
          className="px-4 py-2 font-mono text-xs hover:bg-[#141414]/10 transition-colors"
        >
          CANCEL
        </button>
        <button 
          onClick={handleSubmit}
          className="bg-[#141414] text-[#E4E3E0] px-6 py-2 font-mono text-xs hover:bg-opacity-90 transition-opacity flex items-center gap-2"
        >
          <Save className="w-3 h-3" />
          SAVE CHANGES
        </button>
      </div>
    </div>
  );
};
