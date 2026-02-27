import React from 'react';
import { BriefItem, Category } from '../types';
import { Truck, Package, UserCog, Plus, ChevronUp } from 'lucide-react';

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  autoFocus?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  autoFocus = false,
}) => (
  <div>
    <label className="block text-xs font-mono uppercase opacity-60 mb-1">{label}</label>
    <input
      type="text"
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-white border border-[#141414] p-2 font-mono text-sm focus:outline-none focus:border-emerald-500"
      placeholder={placeholder}
      autoFocus={autoFocus}
    />
  </div>
);

interface TextareaInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export const TextareaInput: React.FC<TextareaInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  required = false,
}) => (
  <div>
    <label className="block text-xs font-mono uppercase opacity-60 mb-1">{label}</label>
    <textarea
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-white border border-[#141414] p-2 font-mono text-sm focus:outline-none focus:border-emerald-500 min-h-[100px] resize-none"
      placeholder={placeholder}
    />
  </div>
);

interface CategorySelectProps {
  value: Category;
  onChange: (value: Category) => void;
}

export const CategorySelect: React.FC<CategorySelectProps> = ({ value, onChange }) => (
  <div className="grid grid-cols-1 gap-4">
    <div>
      <label className="block text-xs font-mono uppercase opacity-60 mb-1">Category</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Category)}
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
);

interface ProviderSelectProps {
  value: BriefItem['provider'];
  onChange: (value: BriefItem['provider']) => void;
}

export const ProviderSelect: React.FC<ProviderSelectProps> = ({ value, onChange }) => (
  <div>
    <label className="block text-xs font-mono uppercase opacity-60 mb-1">Provider</label>
    <div className="flex items-center gap-1 bg-[#141414]/5 p-1 rounded-lg border border-[#141414]/5 w-full">
      <button
        type="button"
        onClick={() => onChange('BAND')}
        className={`flex items-center justify-center rounded transition-colors ${
          value === 'BAND'
            ? 'flex-1 px-3 py-2 text-[10px] font-mono bg-indigo-100 text-indigo-800 border-indigo-300 font-bold border'
            : 'px-4 py-2.5 text-[10px] font-mono opacity-50 hover:opacity-100'
        }`}
      >
        <Truck className="w-4 h-4" />
        {value === 'BAND' && <span className="ml-1">BAND</span>}
      </button>
      <button
        type="button"
        onClick={() => onChange('VENUE')}
        className={`flex items-center justify-center rounded transition-colors ${
          value === 'VENUE'
            ? 'flex-1 px-3 py-2 text-[10px] font-mono bg-neutral-100 text-neutral-800 border-neutral-300 font-bold border'
            : 'px-4 py-2.5 text-[10px] font-mono opacity-50 hover:opacity-100'
        }`}
      >
        <Package className="w-4 h-4" />
        {value === 'VENUE' && <span className="ml-1">VENUE</span>}
      </button>
      <button
        type="button"
        onClick={() => onChange('ENGINEER')}
        className={`flex items-center justify-center rounded transition-colors ${
          value === 'ENGINEER'
            ? 'flex-1 px-3 py-2 text-[10px] font-mono bg-cyan-100 text-cyan-800 border-cyan-300 font-bold border'
            : 'px-4 py-2.5 text-[10px] font-mono opacity-50 hover:opacity-100'
        }`}
      >
        <UserCog className="w-4 h-4" />
        {value === 'ENGINEER' && <span className="ml-1">ENGINEER</span>}
      </button>
    </div>
  </div>
);

interface SpecsFieldProps {
  label: string;
  value: string | number | undefined;
  onChange: (value: string | number | undefined) => void;
  type?: 'text' | 'number';
  placeholder?: string;
}

export const SpecsField: React.FC<SpecsFieldProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}) => (
  <div>
    <label className="block text-xs font-mono uppercase opacity-60 mb-1">{label}</label>
    <input
      type={type}
      value={type === 'number' ? (value || '') : (value || '')}
      onChange={(e) => {
        if (type === 'number') {
          onChange(e.target.value ? parseInt(e.target.value) : undefined);
        } else {
          onChange(e.target.value || undefined);
        }
      }}
      className="w-full bg-white border border-[#141414] p-2 font-mono text-sm"
      placeholder={placeholder}
    />
  </div>
);

interface SpecsSectionProps {
  specs: BriefItem['specs'];
  onSpecsChange: (specs: BriefItem['specs']) => void;
  collapsed?: boolean;
  onToggle?: () => void;
}

export const SpecsSection: React.FC<SpecsSectionProps> = ({
  specs,
  onSpecsChange,
  collapsed = false,
  onToggle,
}) => {
  const showHeader = onToggle !== undefined;

  if (showHeader) {
    return (
      <div className="pt-4 border-t border-[#141414]/10">
        <button
          type="button"
          onClick={onToggle}
          className="flex items-center gap-2 text-xs font-mono uppercase opacity-60 hover:opacity-100 transition-opacity mb-3"
        >
          {collapsed ? <Plus className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
          {collapsed ? 'Add Technical Details' : 'Hide Technical Details'}
        </button>

        {!collapsed && (
          <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <SpecsField
              label="Make"
              value={specs.make || ''}
              onChange={(val) => onSpecsChange({ ...specs, make: val as string })}
              placeholder="e.g. Shure"
            />
            <SpecsField
              label="Model"
              value={specs.model || ''}
              onChange={(val) => onSpecsChange({ ...specs, model: val as string })}
              placeholder="e.g. SM58"
            />
            <SpecsField
              label="Quantity"
              value={specs.quantity || ''}
              onChange={(val) => onSpecsChange({ ...specs, quantity: val as number })}
              type="number"
            />
            <SpecsField
              label="Notes"
              value={specs.notes || ''}
              onChange={(val) => onSpecsChange({ ...specs, notes: val as string })}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="pt-4 border-t border-[#141414]/10">
      <h3 className="font-serif-italic text-sm opacity-50 uppercase tracking-wider mb-3">
        Specifications
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <SpecsField
          label="Make"
          value={specs.make || ''}
          onChange={(val) => onSpecsChange({ ...specs, make: val as string })}
        />
        <SpecsField
          label="Model"
          value={specs.model || ''}
          onChange={(val) => onSpecsChange({ ...specs, model: val as string })}
        />
        <SpecsField
          label="Quantity"
          value={specs.quantity || ''}
          onChange={(val) => onSpecsChange({ ...specs, quantity: val as number })}
          type="number"
        />
        <SpecsField
          label="Notes"
          value={specs.notes || ''}
          onChange={(val) => onSpecsChange({ ...specs, notes: val as string })}
        />
      </div>
    </div>
  );
};
