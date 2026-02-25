import React, { useState } from 'react';
import { Category, ItemType, BriefItem } from '../types';
import { X } from 'lucide-react';
import { motion } from 'motion/react';

interface NewItemModalProps {
  onClose: () => void;
  onSave: (item: Omit<BriefItem, 'id' | 'status' | 'comments' | 'assignedTo'>) => void;
  role: Role;
}

export const NewItemModal: React.FC<NewItemModalProps> = ({ onClose, onSave, role }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('MICROPHONES');
  const [type, setType] = useState<ItemType>('EXACT');
  const [description, setDescription] = useState('');
  const [requestedBy, setRequestedBy] = useState(role === 'BAND' ? 'Band Member' : 'Engineer');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      category,
      type,
      description,
      requestedBy
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={onClose} 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="relative bg-[#E4E3E0] w-full max-w-lg shadow-2xl border border-[#141414] flex flex-col z-10"
      >
        <div className="flex items-center justify-between p-4 border-b border-[#141414] bg-white/50">
          <h2 className="font-bold font-mono tracking-tight">ADD BRIEF ITEM</h2>
          <button onClick={onClose} className="p-1 hover:bg-[#141414] hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase opacity-60 mb-1">Title</label>
            <input 
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-white border border-[#141414] p-2 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-[#141414]"
              placeholder="e.g. Bass DI"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase opacity-60 mb-1">Category</label>
              <select 
                value={category}
                onChange={e => setCategory(e.target.value as Category)}
                className="w-full bg-white border border-[#141414] p-2 font-mono text-sm focus:outline-none"
              >
                <option value="MONITORING">MONITORING</option>
                <option value="MICROPHONES">MICROPHONES</option>
                <option value="PA">PA</option>
                <option value="BACKLINE">BACKLINE</option>
                <option value="LIGHTING">LIGHTING</option>
                <option value="STAGE">STAGE</option>
                <option value="POWER">POWER</option>
                <option value="HOSPITALITY">HOSPITALITY</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono uppercase opacity-60 mb-1">Type</label>
              <select 
                value={type}
                onChange={e => setType(e.target.value as ItemType)}
                className="w-full bg-white border border-[#141414] p-2 font-mono text-sm focus:outline-none"
              >
                <option value="EXACT">EXACT</option>
                <option value="DEFER">DEFER</option>
                <option value="ALTERNATIVE">ALTERNATIVE</option>
                <option value="QUESTION">QUESTION</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase opacity-60 mb-1">Description / Specs</label>
            <textarea 
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-white border border-[#141414] p-2 font-mono text-sm focus:outline-none h-24 resize-none"
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

          <div className="pt-4 flex justify-end gap-2">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 font-mono text-xs border border-transparent hover:border-[#141414]"
            >
              CANCEL
            </button>
            <button 
              type="submit"
              className="px-6 py-2 bg-[#141414] text-[#E4E3E0] font-mono text-xs hover:bg-opacity-90"
            >
              CREATE ITEM
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
