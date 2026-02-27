import React, { useState } from 'react';
import { BriefItem, Category, Role } from '../types';
import { X, Save } from 'lucide-react';
import {
  TextInput,
  TextareaInput,
  CategorySelect,
  ProviderSelect,
  SpecsSection,
} from './FormFields';

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
  const [provider, setProvider] = useState<BriefItem['provider']>(role === 'BAND' ? 'BAND' : 'ENGINEER');
  const [specs, setSpecs] = useState<BriefItem['specs']>({});
  const [showSpecs, setShowSpecs] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      category,
      description,
      requestedBy,
      provider,
      specs
    });
  };

  return (
    <div className="w-full md:w-[400px] bg-[#E4E3E0] border-l border-[#141414] h-full flex flex-col shadow-2xl z-20">
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
        <TextInput
          label="Title"
          value={title}
          onChange={setTitle}
          placeholder="e.g. Bass DI"
          required
          autoFocus
        />

        <CategorySelect value={category} onChange={setCategory} />

        <ProviderSelect value={provider} onChange={setProvider} />

        <TextareaInput
          label="Description"
          value={description}
          onChange={setDescription}
          placeholder="Describe requirements..."
          required
        />

        <TextInput
          label="Requested By"
          value={requestedBy}
          onChange={setRequestedBy}
        />

        <SpecsSection
          specs={specs}
          onSpecsChange={setSpecs}
          collapsed={!showSpecs}
          onToggle={() => setShowSpecs(!showSpecs)}
        />
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
