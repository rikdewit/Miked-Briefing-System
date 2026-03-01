import React, { useState, useEffect, useRef } from 'react';
import { BriefItem, ChatMessage, Role, ItemStatus, Category } from '../types';
import {
  TextInput, TextareaInput, CategorySelect, ProviderSelect, SpecsSection,
} from './FormFields';
import { Send, MessageSquare, ChevronLeft, Save } from 'lucide-react';
import { ItemDetailView } from './ItemDetailView';

type Filter = 'ALL' | 'CHAT' | 'UPDATES';

interface GlobalChatProps {
  messages: ChatMessage[];
  role: Role;
  onSendMessage: (text: string) => void;
  onSelectItem: (itemId: string) => void;
  // Item detail mode
  selectedItem?: BriefItem | null;
  onCloseItem: () => void;
  onAddComment: (id: string, text: string) => void;
  onUpdateStatus: (id: string, status: BriefItem['status']) => void;
  onUpdateProvider: (id: string, provider: BriefItem['provider']) => void;
  onEdit: () => void;
  onReopen: (id: string, message: string) => void;
  // Edit mode
  editingItem?: BriefItem | null;
  onSaveEdit: (id: string, updates: Partial<BriefItem>) => void;
  onCloseEdit: () => void;
  // New item mode
  isNewItemOpen?: boolean;
  onSaveNew: (itemData: Omit<BriefItem, 'id' | 'status' | 'comments' | 'assignedTo'>) => void;
  onCloseNew: () => void;
}

const STATUS_STYLES: Record<ItemStatus, string> = {
  AGREED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  DISCUSSING: 'bg-amber-100 text-amber-800 border-amber-200',
  PENDING: 'bg-neutral-100 text-neutral-600 border-neutral-200',
  REJECTED: 'bg-red-100 text-red-800 border-red-200',
};

const CATEGORY_LABEL: Record<Category, string> = {
  MONITORING: 'Monitoring', MICROPHONES: 'Microphones', PA: 'PA',
  BACKLINE: 'Backline', LIGHTING: 'Lighting', STAGE: 'Stage',
  POWER: 'Power', HOSPITALITY: 'Hospitality',
};

// ── Shared sidebar shell ──────────────────────────────────────────────────────
const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-[520px] shrink-0 bg-[#E4E3E0] border-l border-[#141414] flex flex-col overflow-hidden">
    {children}
  </div>
);

// ── System update card (global chat) ─────────────────────────────────────────
const SystemUpdateCard: React.FC<{ msg: ChatMessage; onSelectItem: (id: string) => void }> = ({ msg, onSelectItem }) => {
  const snap = msg.itemSnapshot;
  return (
    <div className="flex justify-center my-3 px-2">
      <div className="w-full max-w-[85%] border border-[#141414]/20 bg-white/60 p-3 text-xs font-mono">
        {msg.itemCategory && (
          <div className="text-[10px] uppercase tracking-widest opacity-40 mb-1">{CATEGORY_LABEL[msg.itemCategory]}</div>
        )}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="font-bold truncate">{msg.itemTitle}</span>
          {msg.itemId && (
            <button onClick={() => onSelectItem(msg.itemId!)} className="shrink-0 text-[10px] uppercase tracking-wider border border-[#141414] px-2 py-0.5 hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors">
              OPEN →
            </button>
          )}
        </div>
        {msg.updateType === 'STATUS_CHANGE' && snap?.previousStatus && snap?.newStatus && (
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-full border text-[10px] uppercase ${STATUS_STYLES[snap.previousStatus]} opacity-50 line-through`}>{snap.previousStatus}</span>
            <span className="opacity-40">→</span>
            <span className={`px-2 py-0.5 rounded-full border text-[10px] uppercase ${STATUS_STYLES[snap.newStatus]}`}>{snap.newStatus}</span>
          </div>
        )}
        {msg.updateType === 'PROVIDER_CHANGE' && snap?.previousProvider && snap?.newProvider && (
          <div className="flex items-center gap-2">
            <span className="opacity-40 uppercase text-[10px] line-through">{snap.previousProvider}</span>
            <span className="opacity-40">→</span>
            <span className="font-bold uppercase text-[10px]">{snap.newProvider}</span>
          </div>
        )}
        {msg.updateType === 'ITEM_REVISION' && snap?.changes && snap.changes.length > 0 && (
          <div className="space-y-0.5">{snap.changes.map((c, i) => <div key={i} className="opacity-60">{c}</div>)}</div>
        )}
        <div className="mt-2 opacity-30 text-[10px]">
          {msg.author} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

// ── Edit view ─────────────────────────────────────────────────────────────────
const EditView: React.FC<{
  item: BriefItem;
  onSave: (id: string, updates: Partial<BriefItem>) => void;
  onClose: () => void;
}> = ({ item, onSave, onClose }) => {
  const [title, setTitle] = useState(item.title);
  const [category, setCategory] = useState<Category>(item.category);
  const [description, setDescription] = useState(item.description);
  const [specs, setSpecs] = useState(item.specs || {});
  const [provider, setProvider] = useState<BriefItem['provider']>(item.provider);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(item.id, { title, category, description, specs, provider });
  };

  return (
    <Shell>
      <div className="flex items-center justify-between px-4 py-4 border-b border-[#141414] shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={onClose} className="p-1.5 hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors rounded-full shrink-0">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
            <h2 className="text-sm font-bold font-mono tracking-tight uppercase truncate">Edit Item</h2>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
        <TextInput label="Title" value={title} onChange={setTitle} required />
        <CategorySelect value={category} onChange={setCategory} />
        <ProviderSelect value={provider} onChange={setProvider} />
        <TextareaInput label="Description" value={description} onChange={setDescription} required />
        <SpecsSection specs={specs} onSpecsChange={setSpecs} />
      </form>
      <div className="p-4 border-t border-[#141414] bg-[#E4E3E0] flex justify-end gap-2 shrink-0">
        <button type="button" onClick={onClose} className="px-4 py-2 font-mono text-xs hover:bg-[#141414]/10 transition-colors">
          CANCEL
        </button>
        <button onClick={handleSubmit} className="bg-[#141414] text-[#E4E3E0] px-6 py-2 font-mono text-xs hover:bg-opacity-90 transition-opacity flex items-center gap-2">
          <Save className="w-3 h-3" />
          SAVE CHANGES
        </button>
      </div>
    </Shell>
  );
};

// ── New item view ─────────────────────────────────────────────────────────────
const NewView: React.FC<{
  role: Role;
  onSave: (itemData: Omit<BriefItem, 'id' | 'status' | 'comments' | 'assignedTo'>) => void;
  onClose: () => void;
}> = ({ role, onSave, onClose }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('MICROPHONES');
  const [description, setDescription] = useState('');
  const [requestedBy, setRequestedBy] = useState(role === 'BAND' ? 'Band Member' : 'Engineer');
  const [provider, setProvider] = useState<BriefItem['provider']>(role === 'BAND' ? 'BAND' : 'ENGINEER');
  const [specs, setSpecs] = useState<BriefItem['specs']>({});
  const [showSpecs, setShowSpecs] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, category, description, requestedBy, provider, specs });
  };

  return (
    <Shell>
      <div className="flex items-center justify-between px-4 py-4 border-b border-[#141414] shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={onClose} className="p-1.5 hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors rounded-full shrink-0">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-neutral-400 shrink-0" />
            <h2 className="text-sm font-bold font-mono tracking-tight uppercase truncate">New Item</h2>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
        <TextInput label="Title" value={title} onChange={setTitle} placeholder="e.g. Bass DI" required autoFocus />
        <CategorySelect value={category} onChange={setCategory} />
        <ProviderSelect value={provider} onChange={setProvider} />
        <TextareaInput label="Description" value={description} onChange={setDescription} placeholder="Describe requirements..." required />
        <TextInput label="Requested By" value={requestedBy} onChange={setRequestedBy} />
        <SpecsSection specs={specs} onSpecsChange={setSpecs} collapsed={!showSpecs} onToggle={() => setShowSpecs(s => !s)} />
      </form>
      <div className="p-4 border-t border-[#141414] bg-[#E4E3E0] flex justify-end gap-2 shrink-0">
        <button type="button" onClick={onClose} className="px-4 py-2 font-mono text-xs hover:bg-[#141414]/10 transition-colors">
          CANCEL
        </button>
        <button onClick={handleSubmit} className="bg-[#141414] text-[#E4E3E0] px-6 py-2 font-mono text-xs hover:bg-opacity-90 transition-opacity flex items-center gap-2">
          <Save className="w-3 h-3" />
          CREATE ITEM
        </button>
      </div>
    </Shell>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
export const GlobalChat: React.FC<GlobalChatProps> = ({
  messages, role, onSendMessage, onSelectItem,
  selectedItem, onCloseItem, onAddComment, onUpdateStatus, onUpdateProvider, onEdit, onReopen,
  editingItem, onSaveEdit, onCloseEdit,
  isNewItemOpen, onSaveNew, onCloseNew,
}) => {
  const [text, setText] = useState('');
  const [filter, setFilter] = useState<Filter>('ALL');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedItem?.comments]);

  // ── NEW mode ────────────────────────────────────────────────────────────────
  if (isNewItemOpen) {
    return <NewView role={role} onSave={onSaveNew} onClose={onCloseNew} />;
  }

  // ── EDIT mode ───────────────────────────────────────────────────────────────
  if (editingItem) {
    return <EditView item={editingItem} onSave={onSaveEdit} onClose={onCloseEdit} />;
  }

  // ── ITEM mode ───────────────────────────────────────────────────────────────
  if (selectedItem) {
    return (
      <ItemDetailView
        item={selectedItem}
        role={role}
        onClose={onCloseItem}
        onAddComment={onAddComment}
        onUpdateStatus={onUpdateStatus}
        onEdit={onEdit}
        onReopen={onReopen}
      />
    );
  }

  // ── GLOBAL mode ─────────────────────────────────────────────────────────────
  const filtered = messages.filter(msg => {
    if (filter === 'CHAT') return !msg.isSystemUpdate;
    if (filter === 'UPDATES') return msg.isSystemUpdate;
    return true;
  });

  const handleSubmitGlobal = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) { onSendMessage(text.trim()); setText(''); }
  };

  const filterBtn = (f: Filter, label: string) => (
    <button onClick={() => setFilter(f)} className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider transition-colors ${filter === f ? 'bg-[#141414] text-[#E4E3E0]' : 'opacity-40 hover:opacity-80'}`}>
      {label}
    </button>
  );

  return (
    <Shell>
      <div className="flex items-center gap-2 px-6 py-4 border-b border-[#141414] shrink-0">
        <MessageSquare className="w-4 h-4 opacity-60" />
        <h2 className="text-sm font-bold font-mono tracking-tight uppercase">Chat</h2>
        <span className="text-[10px] font-mono opacity-40">{messages.length} messages</span>
      </div>
      <div className="flex gap-1 px-4 py-2 border-b border-[#141414]/10 shrink-0">
        {filterBtn('ALL', 'All')}{filterBtn('CHAT', 'Chat')}{filterBtn('UPDATES', 'Updates')}
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {filtered.length === 0 && <p className="text-center font-mono text-xs opacity-30 py-8">No messages yet.</p>}
        {filtered.map((msg) => {
          if (msg.isSystemUpdate) return <SystemUpdateCard key={msg.id} msg={msg} onSelectItem={onSelectItem} />;
          const isOwn = msg.role === role;
          const bubbleStyle = msg.role === 'BAND' ? 'bg-indigo-100 text-indigo-900 border-indigo-200' : 'bg-cyan-100 text-cyan-900 border-cyan-200';
          return (
            <div key={msg.id} className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} mb-1`}>
              <div className={`max-w-[80%] px-3 py-2 border text-sm ${bubbleStyle}`}>{msg.text}</div>
              <span className="font-mono text-[10px] mt-0.5 opacity-40">
                {msg.author} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-[#141414] bg-[#E4E3E0] shrink-0">
        <form onSubmit={handleSubmitGlobal} className="flex gap-2">
          <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Message everyone..."
            className="flex-1 bg-transparent border-b border-[#141414] px-2 py-2 font-mono text-sm focus:outline-none focus:border-b-2" />
          <button type="submit" disabled={!text.trim()} className="p-2 bg-[#141414] text-[#E4E3E0] disabled:opacity-50 hover:opacity-80 transition-opacity">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </Shell>
  );
};
