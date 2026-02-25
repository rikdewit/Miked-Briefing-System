import React, { useState } from 'react';
import { BriefItem, Category, Role } from '../types';
import { X, Save } from 'lucide-react';

interface NewItemPanelProps {
  role: Role;
  onClose: () => void;
  onSave: (item: Omit<BriefItem, 'id' | 'status' | 'comments' | 'assignedTo'>) => void;
}

export const NewItemPanel: React.FC<NewItemPanelProps> = ({ role, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('MICROPHONES');
  const [description, setDescription] = useState('');
  const [requestedBy, setRequestedBy] = useState(role === 'BAND' ? 'Band Member' : 'Engineer');
  const [specs, setSpecs] = useState<BriefItem['specs']>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      category,
      description,
      requestedBy,
      provider: role === 'BAND' ? 'BAND' : 'ENGINEER',
      specs
    });
  };

  return (
    <div className="w-[400px] bg-[#E4E3E0] border-l border-[#141414] h-full flex flex-col shadow-2xl z-20">
      {/* Header */}
      <div className="h-16 border-b border-[#141414] flex items-center justify-between px-6 shrink-0 bg-[#E4E3E0]">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-neutral-400" />
          <h2 className="text-xl font-bold font-mono tracking-tight">NEW ITEM</h2>
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
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full bg-white border border-[#141414] p-2 font-mono text-sm focus:outline-none focus:border-emerald-500"
            placeholder="e.g. Bass DI"
            autoFocus
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase opacity-60 mb-1">Category</label>
            <select 
              value={category}
              onChange={e => setCategory(e.target.value as Category)}
              className="w-full bg-white border border-[#141414] p-2 font-mono text-sm focus:outline-none"
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
          <label className="block text-xs font-mono uppercase opacity-60 mb-1">Description</label>
          <textarea 
            required
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full bg-white border border-[#141414] p-2 font-mono text-sm focus:outline-none min-h-[100px] resize-none"
            placeholder="Describe requirements..."
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase opacity-60 mb-1">Requested By</label>
          <input 
            value={requestedBy}
            onChange={e => setRequestedBy(e.target.value)}
            className="w-full bg-white border border-[#141414] p-2 font-mono text-sm focus:outline-none"
          />
        </div>

        <div className="pt-4 border-t border-[#141414]/10">
          <h3 className="font-serif-italic text-sm opacity-50 uppercase tracking-wider mb-3">Specifications (Optional)</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase opacity-60 mb-1">Make</label>
              <input 
                value={specs?.make || ''}
                onChange={e => setSpecs({...specs, make: e.target.value})}
                className="w-full bg-white border border-[#141414] p-2 font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase opacity-60 mb-1">Model</label>
              <input 
                value={specs?.model || ''}
                onChange={e => setSpecs({...specs, model: e.target.value})}
                className="w-full bg-white border border-[#141414] p-2 font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase opacity-60 mb-1">Quantity</label>
              <input 
                type="number"
                value={specs?.quantity || ''}
                onChange={e => setSpecs({...specs, quantity: parseInt(e.target.value) || undefined})}
                className="w-full bg-white border border-[#141414] p-2 font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase opacity-60 mb-1">Notes</label>
              <input 
                value={specs?.notes || ''}
                onChange={e => setSpecs({...specs, notes: e.target.value})}
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
          CREATE ITEM
        </button>
      </div>
    </div>
  );
};
